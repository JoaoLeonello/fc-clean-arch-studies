import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase, { OutputMapper } from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Chinelo", 28.00);
const product2 = ProductFactory.create("a", "Camiseta", 29.00);

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

describe("Test list product use case", () => {
  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    
    // @ts-ignore
    await productRepository.create(product1);
    // @ts-ignore
    await productRepository.create(product2);

    const input = [
        { id: product1.id },
        { id: product2.id }
    ]

    // @ts-ignore
    const output = OutputMapper.toOutput([ product1, product2 ]);

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });

});