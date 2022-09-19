
export class Notifications {

    public static observers: Array<any> = [];

    public static emailSubscriber(observer: Function) {
        Notifications.observers.push(observer);
    }

    public static messageSubscriber(observer: Function) {
        Notifications.observers.push(observer);
    }

    public static pushNotificationSubscriber(observer: Function) {
        Notifications.observers.push(observer);
    }

    public static async fire() {
        for (const observer of Notifications.observers) {
            await observer.call();
        }
        Notifications.observers = [];
    }
}