import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./create.product.usecase";

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

describe("Test create product use case", () => {
  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const input = {
      name: product.name,
      price: product.price
    };

    const result = await usecase.execute(input);

    const output = {
        id: result.id,
        name: result.name,
        price: result.price
      };

    expect(result).toEqual(output);
  });

});