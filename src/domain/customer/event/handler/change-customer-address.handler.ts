import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../change-customer-address.event";

export default class ChangeCustomerAddressHandler 
    implements EventHandlerInterface<CustomerAddressChangedEvent> 
{
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address._street}, ${event.eventData.address._number}, ${event.eventData.address._city} - ${event.eventData.address._zip}`);
    }
} 
