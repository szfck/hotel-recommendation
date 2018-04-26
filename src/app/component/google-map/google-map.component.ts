import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { UserService } from '../../service';
import { Hotel } from '../../constant';
@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
    title: string = 'Hotel Recommendation Demo';
    myMap;
    hotelMarkers = [];
    hotels: Hotel[];
    tagItems: {[tag: string]: Hotel[]} = {};

    constructor(private userServie: UserService) { }

    ngOnInit() {
        this.initAutocomplete();
    }

    // data = [
    //     [40.6945088, -73.9871052],
    //     [40.7000000, -74.0000000]
    //     // [-87.62374260000001,41.8952022],
    // ];

    recommend() {
        // this.addMarkers();
        this.hotels = this.userServie.getRecommendHotels();

        // Clear out the old markers.
        this.hotelMarkers.forEach(function (marker) {
            marker.setMap(null);
        });

        this.tagItems = {};

        // add tags
        this.hotels.forEach(hotel => {
            hotel.tags.forEach(tag => {
                this.tagItems[tag].push(hotel);
            });
        });

        this.hotels.forEach(hotel => {
            this.hotelMarkers.push(new google.maps.Marker({
                map: this.myMap,
                title: hotel.name,
                position: new google.maps.LatLng(hotel.lat, hotel.lng)
            }));
            console.log(hotel);
        });

        
    }

    clear() {
        this.hotelMarkers.forEach(function (marker) {
            marker.setMap(null);
        });
        this.hotels = [];
    }
    

    // addMarkers() {
        
        
    // }


    initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.6945088, -73.9871052),
            zoom: 4,
            // minZoom: 1
            // center: { lat: 40.6945088, lng: -73.9871052 },
            // zoom: 12,
            // mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        this.myMap = map;

        // Create the search box and link it to the UI element.
        var input: HTMLInputElement = <HTMLInputElement>document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        // Layer with all the hotel location markers
        //    let ctaLayer = new google.maps.KmlLayer({
        //             //need to host kml file on public server which google can search for
        //             url: 'https://raw.githubusercontent.com/pengcheng95/hbdmap/master/HBD.kml',
        //             map: map
        //         });

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
