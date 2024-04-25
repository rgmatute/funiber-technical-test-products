<template>
    <div :style="products && products.length === 0 ? 'height: 430px !important' : ''">
        <h2 id="page-heading" data-cy="CatalogHeading">
            <span id="products-heading">Products</span>
            <br>
            <div class="d-flex justify-content-end">
                <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
                    <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon> <span>Refrescar</span>
                </button>
                <button class="btn btn-primary ml-2" v-on:click="onRegister()">
                    <font-awesome-icon icon="plus"></font-awesome-icon> <span>Registrar Producto</span>
                </button>
            </div>
        </h2>

        <br />
        <div class="alert alert-warning" v-if="!isFetching && products && products.length === 0">
            <span>No products found</span>
        </div>

        <div class="d-flex justify-content-end" v-if="products && products.length > 0">
            <!-- buscador -->
            <b-form-group label="Search by filter" class="mb-0">
                <b-input-group size="md" class="mb-2">
                    <b-input-group-prepend>
                        <b-button variant="secondary" size="md" @click="onSearch()">
                            <font-awesome-icon icon="cog" class="small"></font-awesome-icon>
                            Setting
                        </b-button>
                    </b-input-group-prepend>
                    <b-form-input id="input-products-search-value" v-model="searchStringValue"
                        v-on:keyup.enter="onSearch()" placeholder="Enter your value"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="primary" size="md" @click="onSearch()">
                            <font-awesome-icon icon="search" class="small"></font-awesome-icon>
                            Search
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </div>

        <div class="table-responsive" v-if="products && products.length > 0">
            <table class="table table-striped table-sm table-bordered" aria-describedby="products">
                <thead class="text-center">
                    <tr>
                        <th scope="row"><span></span></th>
                        <th scope="row"><span>Code</span></th>
                        <th scope="row"><span>Category</span></th>
                        <th scope="row"><span>Name</span></th>
                        <th scope="row"><span>Price</span></th>
                        <th scope="row"><span>Tax</span></th>
                        <th scope="row"><span>Discount</span></th>
                        <th scope="row"><span>Stock</span></th>
                        <th scope="row"><span>Description</span></th>
                        <th scope="row"><span>Created by</span></th>
                        <th scope="row"><span>Status</span></th>
                        <th scope="row"></th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="product in products" :key="product.id" data-cy="entityTable">

                        <td class="align-middle"></td>
                        <td class="align-middle">{{ product.serial_code }}</td>
                        <td class="align-middle">
                            <b-badge variant="warning">{{ product.catalog.catalog_name }}</b-badge>
                        </td>
                        <td class="align-middle">{{ product.name }}</td>
                        <td class="align-middle small text-primary">$ {{ product.price }}</td>
                        <td class="align-middle small badge">{{ product.iva }}%</td>
                        <td class="align-middle small">{{ product.discount }}%</td>
                        <td class="align-middle">
                            <b-badge v-if="product.stock > 0" variant="info" size="sm" :text="String(product.stock)">{{
        product.stock }}</b-badge>
                            <b-badge v-else variant="danger" size="sm" :text="String(product.stock)">{{ product.stock
                                }}</b-badge>
                        </td>
                        <td class="align-middle text-muted">{{ product.description }}</td>
                        <td class="align-middle small text-muted">{{ product.created_by }}</td>

                        <td class="align-middle">
                            <b-badge v-if="product.status == true" variant="success">ACTIVE</b-badge>
                            <b-badge v-else variant="danger">INACTIVE</b-badge>
                        </td>
                        <td class="align-middle">
                            <!-- <b-button variant="primary" size="sm" @click="editCatalog(catalog)">
                                <font-awesome-icon icon="pencil" size="sm"></font-awesome-icon> Edit
                            </b-button>

                            <b-button variant="danger" size="sm" @click="prepareRemove(catalog)">
                                <font-awesome-icon icon="trash" size="sm"></font-awesome-icon> Detele
                            </b-button> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div v-show="products && products.length > 0">
            <div class="row justify-content-center">
                <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
            </div>
            <div class="row justify-content-center">
                <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"
                    :change="loadPage(page)"></b-pagination>
            </div>
        </div>
    </div>
</template>


<script lang="ts" src="./product.component.ts"></script>