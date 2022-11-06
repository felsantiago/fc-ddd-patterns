import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import Address from "../../value-object/address";
import CustomerAddressUpdatedEvent from "../customer-address-updated.event";

interface ICustomer {
  id: string;
  name: string;
  Address: Address;
}

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressUpdatedEvent> {
  handle(event: CustomerAddressUpdatedEvent): void {
    const { id, name, Address: address } = event.eventData as ICustomer;
    console.log(`Endereço do cliente ${id}, ${name} alterado para ${address}`);
  }
}
