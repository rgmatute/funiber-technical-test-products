<?php

namespace App\Repository;

use App\Domain\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository
{

    public function findAll(): LengthAwarePaginator
    {
        return Product::with('catalog')->where('status', true)->paginate(20);
    }

    public function findById( int $id){
        return Product::with('catalog')->where('id', $id)->first();
    }

    public function save(Array $product) : int {
        return Product::insertGetId($product);
    }

    public function update(Array $product, $id) : int {
        return Product::where('id', $id)->update($product);
    }

    public function delete($id) : int {
        return Product::where('id', $id)->update(['status' => false]);
    }

    public function search($key, $value) {
        if (strpos($key, "stock") !== false) {
            if ($value == -1) {
                return Product::with('catalog')->where($key, '>', 0)->paginate();
            } else {
                return Product::with('catalog')->where($key, '=', $value)->paginate();
            }
        } else {
            return Product::with('catalog')->where($key, 'like', '%'.$value.'%')->paginate();
        }
    }

    public function isActiveById($id) {
        return Product::with('catalog')->where('id', $id)->where('status', true)->first();
    }

    public function findByIdAndStatus( int $id, bool $status){
        return Product::with('catalog')->where('id', $id)->where('status', $status)->first();
    }
}