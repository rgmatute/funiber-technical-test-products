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
                        <b-button variant="secondary" size="md" @click="onSetting()">
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
            <table class="table table-striped table-sm table-bordered responsive" aria-describedby="products">
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
                        <!-- <th scope="row"><span>Description</span></th> -->
                        <!-- <th scope="row"><span>Created by</span></th> -->
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
                        <!-- <td class="align-middle text-muted">{{ product.description }}</td> -->
                        <!-- <td class="align-middle small text-muted">{{ product.created_by }}</td> -->

                        <td class="align-middle">
                            <b-badge v-if="product.status == true" variant="success">ACTIVE</b-badge>
                            <b-badge v-else variant="danger">INACTIVE</b-badge>
                        </td>
                        <td class="align-middle">
                            <b-button variant="primary" size="sm" @click="onEdit(product)" v-b-tooltip.left
                                title="Editar Producto!">
                                <font-awesome-icon icon="pencil" size="sm"></font-awesome-icon>
                            </b-button>

                            <b-button variant="danger" size="sm" @click="onPrepareRemove(product)" v-b-tooltip.left
                                title="Eliminar Producto!">
                                <font-awesome-icon icon="trash" size="sm"></font-awesome-icon>
                            </b-button>

                            <b-button variant="secondary" size="sm" @click="onHistory(product)"
                                v-b-tooltip.left.html
                                title="Ver <strong class='text-warning'>Historial</strong> del producto!">
                                <font-awesome-icon icon="eye" size="sm"></font-awesome-icon>
                            </b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- modal de eliminar -->
        <b-modal ref="removeEntity" id="removeEntity">
            <span slot="modal-title"><span id="rodechStoreApp.product.delete.question"
                    data-cy="productDeleteDialogHeading">Confirmar operación de eliminación</span></span>
            <div class="modal-body">
                <p id="jhi-delete-product-heading">¿Está seguro de que desea eliminar el producto seleccionado?</p>
                <div class="text-center">
                    <p><strong>Producto: </strong> {{ product.name }}</p>
                    <p><strong>Stock: </strong> {{ product.stock }}</p>
                    <p><strong>Precio: </strong> ${{ product.price }}</p>
                </div>
                <div>
                    <b-alert show variant="warning">
                        <strong>¡Advertencia¡</strong> El producto solo se quedará Inactivo.
                    </b-alert>
                </div>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">
                    <font-awesome-icon icon="ban"></font-awesome-icon>
                    Cancelar
                </button>
                <button type="button" class="btn btn-danger" id="jhi-confirm-delete-product"
                    data-cy="entityConfirmDeleteButton" v-on:click="onRemove()">
                    <font-awesome-icon icon="trash"></font-awesome-icon>
                    Eliminar
                </button>
            </div>
        </b-modal>

        <!-- modal de historial -->
        <b-modal ref="historyEntity" id="historyEntity" size="lg">
            <span slot="modal-title">
                <span>Historial de <strong class="text-danger">"{{ product.name }} "</strong></span>
            </span>
            <div class="modal-body">
                <div>
                    <b-alert show variant="warning">
                        <strong>¡Advertencia¡</strong> Espacio en construcción.
                    </b-alert>
                </div>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">
                    <font-awesome-icon icon="ban"></font-awesome-icon>
                    Cerrar
                </button>
            </div>
        </b-modal>

        <!-- crear y editar modal -->
        <b-modal ref="createdEditEntity" id="createdEditEntity">
            <span slot="modal-title">
                <span>{{ createdTitleModal }}</span>
            </span>
            <div class="modal-body">
                <div>
                    <b-alert show variant="warning">
                        <strong>¡Advertencia¡</strong> Espacio en construcción.
                    </b-alert>
                </div>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">
                    <font-awesome-icon icon="ban"></font-awesome-icon>
                    Cancelar
                </button>
                <b-button variant="primary" v-on:click="onSave()">
                    <font-awesome-icon icon="save"></font-awesome-icon>
                    Guardar
                </b-button>
            </div>
        </b-modal>

        <!-- modal de condifuración de filtro -->
        <b-modal ref="settingEntity" id="settingEntity" size="sm">
            <span slot="modal-title">
                <span>Configuración de filtro</span>
            </span>
            <div class="modal-body">
                <b-form-group label="Filter by fields selected" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                        id="radio-group-2"
                        v-model="filterSelected"
                        :aria-describedby="ariaDescribedby"
                        name="radio-sub-component"
                    >
                        <b-form-radio value="serial_code">filter by code</b-form-radio>
                        <b-form-radio value="name">filter by name</b-form-radio>
                        <b-form-radio value="description">filter by description</b-form-radio>
                        <b-form-radio value="price">filter by price</b-form-radio>
                        <b-form-radio value="iva">filter by iva</b-form-radio>
                        <b-form-radio value="discount">filter by discount</b-form-radio>
                        <b-form-radio value="stock">filter by stock</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">
                    <font-awesome-icon icon="ban"></font-awesome-icon>
                    Cerrar
                </button>
            </div>
        </b-modal>


        <!-- paginación -->
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