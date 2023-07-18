import RepositoryInterface from "../../@shared/repository/repository-interface";
import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";

export default interface ProductRepositoryInterface
  extends RepositoryInterface<Product> {
    create(entity: ProductInterface): Promise<void>;
  }
