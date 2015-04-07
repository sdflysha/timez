﻿/// <reference path="../../scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../../scripts/typings/moment/moment.d.ts" />
module TimezApp {
    export class TimeItem {
        name: KnockoutObservable<string>;
        offset: KnockoutObservable<moment.Duration>;
        time: KnockoutComputed<moment.Moment>;

        constructor(name: string, offset: moment.Duration, systime: KnockoutObservable<moment.Moment>) {
            this.name = ko.observable(name);
            this.offset = ko.observable(offset);
            this.time = ko.computed(() => systime().add(this.offset()));
        }
    }

    export class TimeZ {
        time = ko.observable(moment());
        times = ko.observableArray<TimeItem>([]);

        private load() {
            var str = localStorage.getItem('timez');
            if (str) {
                var data = JSON.parse(str);
                this.time(data.time);
                this.times(data.times);
            }
        }

        save() {
            var data = ko.toJSON(this);
            localStorage.setItem('timez', data);
        }

        add(name: string, offset: moment.Duration) {
            var item = new TimeItem(name, offset, this.time);
            this.times.push(item);
            this.save();
        }

        drop(data: TimeItem) {
            this.times.remove(data);
            this.save();
        }

        constructor() {
            this.load();
            setInterval(() => { this.time(moment()); }, 1000);
        }
    }
}