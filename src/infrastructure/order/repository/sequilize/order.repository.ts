import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await Promise.all([
      entity.items.map(async item => {
        await OrderItemModel.update({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          order_id: entity.id,
          quantity: item.quantity,
        }, { where: { id: item.id }})
      }),

      await OrderModel.upsert({
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      })
    ]);      
  }

  async find(entityId: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ 
      where: { id: entityId },
      include: [{model: OrderItemModel, as: 'items'}]
    })

    return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) =>
    {
      return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    }))
  }

  async findAll(): Promise<Order[]> {
    const orderModelFindAll = await OrderModel.findAll({
      include: [{model: OrderItemModel, as: 'items'}]
    });

    const orderFindAll = orderModelFindAll.map(orderModel => {
      return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) =>
      {
        return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      }))
    })

    return orderFindAll;
  }
}
