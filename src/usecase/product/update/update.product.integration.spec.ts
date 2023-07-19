import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

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

describe("Test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);
    
    // @ts-ignore
    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "Novo chinelo",
      price: 25.00
    };

    const output = {
        id: product.id,
        name: "Novo chinelo",
        price: 25.00
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

});