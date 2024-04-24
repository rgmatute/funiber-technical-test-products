
import AlertService from '@/shared/alert/alert.service';
import { ICatalog } from '@/shared/model/catalog.model';
import { Component, Vue, Inject } from 'vue-property-decorator';
import CatalogService from './catalog.service';

@Component
export default class CatalogComponent extends Vue {

    @Inject('catalogService') private catalogService: () => CatalogService;
    @Inject('alertService') private alertService: () => AlertService;

    public isFetching = false;

    public itemsPerPage = 5;
    public queryCount: number = null;
    public page = 1;
    public previousPage = 1;
    public propOrder = 'id';
    public reverse = false;
    public totalItems = 0;

    public searchStringValue = null;


    public catalogs: ICatalog[] = [];

    public mounted(): void {
        this.retrieveAllCatalogs();
        console.log("CatalogComponent::mounted");
    }

    public handleSyncList(): void {
        this.clear();
    }

    public clear(): void {
        this.retrieveAllCatalogs();
    }

    public retrieveAllCatalogs(): void {
        this.isFetching = true;
        this.catalogService()
            .retrieve({
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort(),
            })
            .then(
                res => {
                    this.catalogs = res.data.data;
                    this.isFetching = false;

                    // this.totalItems = Number(res.headers['x-total-count']);
                    this.totalItems = res.data.total;
                    this.queryCount = this.totalItems;
                },
                err => {
                    this.isFetching = false;
                    this.alertService().showHttpError(this, err.response);
                }
            );
    }

    public transition(): void {
        this.retrieveAllCatalogs();
    }

    public changeOrder(propOrder: string): void {
        this.propOrder = propOrder;
        this.reverse = !this.reverse;
        this.transition();
    }

    public sort(): any {
        const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
        if (this.propOrder !== 'id') {
            result.push('id');
        }
        return result;
    }

    public loadPage(page: number): void {
        console.log("aaaaaaaaaaaa", page, this.previousPage)
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    public searchCatalogs(): void {
        this.isFetching = true;
        this.catalogService()
            .search({
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort(),
                key: 'catalog_name',
                value: this.searchStringValue
            })
            .then(
                res => {
                    this.catalogs = res.data.data;
                    this.isFetching = false;
                    this.totalItems = res.data.total;
                    this.queryCount = this.totalItems;
                },
                err => {
                    this.isFetching = false;
                    this.alertService().showHttpError(this, err.response);
                }
            );
    }


}