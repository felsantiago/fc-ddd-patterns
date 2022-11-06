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
    const items = entity.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id,
    }));

    await OrderItemModel.destroy({ where: { order_id: entity.id } });
    await OrderItemModel.bulkCreate(items);

    await OrderModel.update({
      total: entity.total(),
    }, {
      where: { id: entity.id },
    });
  }

  async find(id: string): Promise<Order> {
    let order;
    try {
      order = await OrderModel.findOne({
        where: { id },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const orderItems = order.items.map((item) => new OrderItem(
      item.id,
      item.name,
      item.price / item.quantity,
      item.product_id,
      item.quantity
    ));

    const orderFound = new Order(order.id, order.customer_id, orderItems);

    orderFound.items.map((item) => {
      item.changePrice(item.price);
      return item;
    });

    return orderFound;
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: ["items"],
    });

    const ordersMapped = orders.map((order) => {
      const orderItems = order.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price / item.quantity,
        item.product_id,
        item.quantity
      ));

      const orderFound = new Order(order.id, order.customer_id, orderItems);

      orderFound.items.map((item) => {
        item.changePrice(item.price);
        return item;
      });

      return orderFound;
    });

    return ordersMapped;
  }
}
