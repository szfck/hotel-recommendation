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
        let nycPos = new google.maps.LatLng(40.6945088, -73.9871052);
        var mapProp = {
            center: nycPos,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.map.setCenter(nycPos);
        
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            let that = this;
            console.log(`start finding position`);
            navigator.geolocation.getCurrentPosition(function (position) {
                // this.map.setCenter(new google.maps.LatLng(40.6945088, -73.9871052));
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log(`find position: ${pos.lat}, ${pos.lng}`);

                that.map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
                that.map.setZoom(12);
            }, function () {
                console.log(`pos error`);
            }, { timeout: 20000 });
        } else {
            // Browser doesn't support Geolocation
            console.log(`pos error`);
        }

        console.log(`finished`);

        var marker = new google.maps.Marker({
            position: nycPos,
            map: this.map
        });

        // Layer with all the hotel location markers
        var ctaLayer = new google.maps.KmlLayer({
            //need to host kml file on public server which google can search for
            url: 'https://raw.githubusercontent.com/pengcheng95/hbdmap/master/HBD.kml',
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
