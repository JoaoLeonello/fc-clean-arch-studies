import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerAddressChangedEvent from "../event/change-customer-address.event";
import ChangeCustomerAddressHandler from "../event/handler/change-customer-address.handler";
import Address from "../value-object/address";

export default class Customer extends Entity {
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;
    this.validate();

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this.id.length === 0) {
      this.notification.addError({
        message: "Id is required",
        context: "customer"
      })
    }
    if (this._name.length === 0) {
      this.notification.addError({
        message: "Name is required",
        context: "customer"
      })
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new ChangeCustomerAddressHandler();
    
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: this._id,
      name: this.name,
      address: address,
    });
    eventDispatcher.notify(customerAddressChangedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
