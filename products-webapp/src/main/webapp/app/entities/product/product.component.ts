import { IProduct } from '@/shared/model/product.model';
import { Component, Vue, Inject } from 'vue-property-decorator';
import ProductService from './product.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class ProductComponent extends Vue {

    @Inject('productService') private productService: () => ProductService;
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
    private removeId: number = null;

    // crear y editar catalogo
    public createdTitleModal = '';
    public product: any = {
        serial_code: null,
        name: null,
        description: null,
        price: null,
        iva: null,
        discount: null,
        resource_id: null,
        stock: null,
        status: null,
        catalog_id: null,
    };


    public products: IProduct[] = [];

    public mounted(): void {
        console.log("ProductComponent::mounted");
        this.retrieveAll();
    }

    public handleSyncList(): void {
        this.clear();
    }

    public clear(): void {
        this.retrieveAll();
    }

    public retrieveAll(): void {
        this.isFetching = true;
        this.productService()
            .retrieve({
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort(),
            })
            .then(
                res => {
                    this.products = res.data.data;
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

    public sort(): any {
        const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
        if (this.propOrder !== 'id') {
            result.push('id');
        }
        return result;
    }

    public loadPage(page: number): void {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    public transition(): void {
        this.retrieveAll();
    }

    public onRegister(): void {

    }

    public onSearch(): void {

    }

    public onEdit(product: IProduct): void {

    }

    public onPrepareRemove(product: IProduct): void {

        this.removeId = product.id;
        this.product = product;

        if (<any>this.$refs.removeEntity) {
            (<any>this.$refs.removeEntity).show();
        }
    }

    public closeDialog(): void {
        (<any>this.$refs.removeEntity).hide();
        (<any>this.$refs.createdEditEntity).hide();
    }

    public onRemove(): void {
        this.productService()
          .delete(this.removeId)
          .then(() => {
            const message = 'A Product is deleted with identifier ' + this.removeId;
            this.$bvToast.toast(message.toString(), {
              toaster: 'b-toaster-top-center',
              title: 'Info',
              variant: 'danger',
              solid: true,
              autoHideDelay: 5000,
            });
            
            this.removeId = null;
            this.product = {};

            this.retrieveAll();
            this.closeDialog();
          })
          .catch(error => {
            this.alertService().showHttpError(this, error.response);
          });
    }
}