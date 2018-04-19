import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
    title: string = 'Hotel Recommendation Demo';
    myMap;

    constructor() { }

    ngOnInit() {
        this.initAutocomplete();
    }
    initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.6945088, lng: -73.9871052 },
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        this.myMap = map;

        // Create the search box and link it to the UI element.
        var input: HTMLInputElement = <HTMLInputElement>document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }

    relocate() {
        console.log('relocateing...');
        var map = this.myMap;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position);
                map.setOptions({
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    zoom: 12
                });
                // map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            }, function () {
                console.log('can not get position, default is nyc ');
                map.setOptions({
                    center: new google.maps.LatLng(40.6945088, -73.9871052),
                    zoom: 12
                });
                // map.setCenter(new google.maps.LatLng(40.6945088, -73.9871052));
            }, { enableHighAccuracy: false, maximumAge: Infinity, timeout: 5000 });
        }
    }
}
