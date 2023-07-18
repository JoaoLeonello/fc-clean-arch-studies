import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

const product = ProductFactory.create("a", "Chinelo", 28.00);

let sequelize: Sequelize;

beforeEach(async () => {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  await sequelize.addModels([ProductModel]);
  await sequelize.sync();
});

afterEach(async () => {
  await sequelize.close();
});

describe("Test find product use case", () => {
  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    
    // @ts-ignore
    await productRepository.create(product);

    const input = {
      id: product.id,
    };

    const output = {
      id: product.id,
      name: product.name,
      price: product.price
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

});