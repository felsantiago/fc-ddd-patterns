import Customer from "../../customer/entity/customer";
import CustomerAddressUpdatedEvent from "../../customer/event/customer-address-updated.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log-handler.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventSendEmailWhenProductIsCreatedHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventEnviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const eventEnviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const eventEnviaConsoleLogHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("ProductCreatedEvent", eventSendEmailWhenProductIsCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog2Handler);
    eventDispatcher.register("CustomerAddressUpdatedEvent", eventEnviaConsoleLogHandler);

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1);
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventSendEmailWhenProductIsCreatedHandler);

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventEnviaConsoleLog1Handler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventEnviaConsoleLog2Handler);

    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent.length).toBe(1);
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent[0]).toMatchObject(eventEnviaConsoleLogHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventSendEmailWhenProductIsCreatedHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventEnviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const eventEnviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const eventEnviaConsoleLogHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("ProductCreatedEvent", eventSendEmailWhenProductIsCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog2Handler);
    eventDispatcher.register("CustomerAddressUpdatedEvent", eventEnviaConsoleLogHandler);

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventSendEmailWhenProductIsCreatedHandler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventEnviaConsoleLog1Handler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventEnviaConsoleLog2Handler);
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent[0]).toMatchObject(eventEnviaConsoleLogHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventSendEmailWhenProductIsCreatedHandler);
    eventDispatcher.unregister("CustomerCreatedEvent", eventEnviaConsoleLog1Handler);
    eventDispatcher.unregister("CustomerCreatedEvent", eventEnviaConsoleLog2Handler);
    eventDispatcher.unregister("CustomerAddressUpdatedEvent", eventEnviaConsoleLogHandler);

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0);

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(0);

    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent).toBeDefined();
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent.length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventSendEmailWhenProductIsCreatedHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventEnviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const eventEnviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const eventEnviaConsoleLogHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("ProductCreatedEvent", eventSendEmailWhenProductIsCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog2Handler);
    eventDispatcher.register("CustomerAddressUpdatedEvent", eventEnviaConsoleLogHandler);

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventSendEmailWhenProductIsCreatedHandler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventEnviaConsoleLog1Handler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventEnviaConsoleLog2Handler);
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent[0]).toMatchObject(eventEnviaConsoleLogHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined();
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeUndefined();
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventSendEmailWhenProductIsCreatedHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventEnviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const eventEnviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const eventEnviaConsoleLogHandler = new EnviaConsoleLogHandler();

    const spyEventSendEmailWhenProductIsCreatedHandler = jest.spyOn(eventSendEmailWhenProductIsCreatedHandler, "handle");
    const spyEventEnviaConsoleLog1Handler = jest.spyOn(eventEnviaConsoleLog1Handler, "handle");
    const spyEventEnviaConsoleLog2Handler = jest.spyOn(eventEnviaConsoleLog2Handler, "handle");
    const spyEventEnviaConsoleLogHandler = jest.spyOn(eventEnviaConsoleLogHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventSendEmailWhenProductIsCreatedHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", eventEnviaConsoleLog2Handler);
    eventDispatcher.register("CustomerAddressUpdatedEvent", eventEnviaConsoleLogHandler);

    expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventSendEmailWhenProductIsCreatedHandler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventEnviaConsoleLog1Handler);
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventEnviaConsoleLog2Handler);
    expect(eventDispatcher.getEventHandlers.CustomerAddressUpdatedEvent[0]).toMatchObject(eventEnviaConsoleLogHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);
    expect(spyEventSendEmailWhenProductIsCreatedHandler).toHaveBeenCalled();

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 21, "ZipCode 1", "City 1");
    customer.changeAddress(address);

    const customerCreatedEvent = new CustomerCreatedEvent(customer)
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventEnviaConsoleLog1Handler).toHaveBeenCalled();
    expect(spyEventEnviaConsoleLog2Handler).toHaveBeenCalled();

    const newAddress = new Address("Street 2", 22, "ZipCode 2", "City 2");
    customer.changeAddress(newAddress);

    const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent(customer);
    eventDispatcher.notify(customerAddressUpdatedEvent);

    expect(spyEventEnviaConsoleLogHandler).toHaveBeenCalled();
  });
});
