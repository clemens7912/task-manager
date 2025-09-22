import { EventEmitter } from "@angular/core";

export interface ActionCompleted {
    actionCompleted: EventEmitter<void>;
}