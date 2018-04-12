import { Component, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('gmap') gmapElement: any;
    map: google.maps.Map;

    latitude: number;
    longitude: number;

    constructor() { }

    ngOnInit() {
        var mapProp = {
            center: new google.maps.LatLng(18.5793, 73.8143),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(18.5793, 73.8143),
            map: this.map
        });
    }

    setMapType(mapTypeId: string) {
        this.map.setMapTypeId(mapTypeId)
    }

    setCenter(e: any) {
        e.preventDefault();
        this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    }
}
