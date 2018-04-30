import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { UserService } from '../../service';
import { Hotel } from '../../constant';
import { environment } from '../../../environments/environment.prod';
@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
    title: string = 'Hotel Recommendation Demo';
    myMap;
    hotels: Hotel[];
    hotelList: Hotel[] = [];
    tagItems: { [tag: string]: Hotel[] } = {};
    tags: string[] = [];
    
    constructor(private userServie: UserService) { }

    addCenter(map, latLng) {
        if (map.centerMarker !== undefined) {
            map.centerMarker.setMap(null);
        }
        var icon = {
            url: "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        map.centerMarker = new google.maps.Marker({
            map: map,
            position: latLng,
            icon: icon
        });
    }

    ngOnInit() {
        this.initAutocomplete();
    }

    clickTag(tag) {
        console.log(tag);
        this.userServie.getToken(token => {
            console.log(token);
            this.userServie.clickTag(token, tag).subscribe(res => {
                console.log(`click tag resp: ${res}`);
            });
        });
        this.filter(tag == 'All' ? false : true, tag);
    }

    filter(isFilter, targetTag?) {
        console.log(targetTag);
        this.hotelList.forEach(hotel => {
            hotel.marker.setMap(null);
        });
        this.hotelList = [];

        this.hotels.forEach(hotel => {
            if (!isFilter || hotel.tags.indexOf(targetTag) > -1) {
                this.hotelList.push(hotel);
            }
        });
        var that = this;
        this.hotelList.forEach(hotel => {
            var marker = new google.maps.Marker({
                map: this.myMap,
                title: hotel.name,
                position: new google.maps.LatLng(hotel.lat, hotel.lng)
            })

            hotel.marker = marker;

            console.log(hotel);

            var infowindow = new google.maps.InfoWindow({
                content: hotel.desc
            });

            marker.addListener('click', function () {
                infowindow.open(that.myMap, marker);
            });

        });

    }

    clickHotel(hotel: Hotel) {
        console.log(hotel);
        new google.maps.event.trigger(hotel.marker, 'click');
    }

    recommend() {
        if (this.myMap.centerMarker === undefined) {
            alert('choose you location first');
            return
        }
        const position = this.myMap.centerMarker.getPosition();

        // console.log(`send postion (${position.lat()}, ${position.lng()})`);
        
        // let that = this;
        this.userServie.getToken(token => {
            this.userServie.getRecommendHotels(token, position).
                subscribe(hotels => {
                    this.hotels = hotels;
                    this.tagItems = {};
                    this.tags = [];
                    
                    this.tagItems['All'] = [];
                    // add tags
                    this.hotels.forEach(hotel => {
                        this.tagItems['All'].push(hotel);
                        hotel.tags.forEach(tag => {
                            console.log(tag);
                            if (this.tagItems[tag] === undefined) {
                                this.tagItems[tag] = [hotel];

                            } else {
                                var tmp = this.tagItems[tag];
                                this.tagItems[tag].push(hotel);
                            }
                        });
                    });

                    

                    for (var tag in this.tagItems) {
                        this.tags.push(tag);
                    }

                    this.filter(false);
                });
        });
    }

    clear() {
        this.hotelList.forEach(hotel => {
            hotel.marker.setMap(null);
        });

        this.hotelList = [];
        this.tagItems = {};
        this.tags = [];
    }

    initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.6945088, -73.9871052),
            zoom: 4,
            minZoom: 3
            // center: { lat: 40.6945088, lng: -73.9871052 },
            // zoom: 12,
            // mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        let that = this;
        google.maps.event.addListener(map, 'click', function (event) {
            console.log(event.latLng);

            that.addCenter(map, event.latLng);
        });

        this.myMap = map;

        // Create the search box and link it to the UI element.
        var input: HTMLInputElement = <HTMLInputElement>document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        // map.addListener('bounds_changed', function () {
        //     searchBox.setBounds(map.getBounds());
        // });

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

            console.log(places.length);


            // Clear out the old markers.
            // markers.forEach(function (marker) {
            //     marker.setMap(null);
            // });
            // markers = [];
            // if (that.centerMarker !== undefined) {
            //     that.centerMarker.setMap(null);
            // }


            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                console.log(place);

                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                // var icon = {
                //     url: place.icon,
                //     size: new google.maps.Size(71, 71),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(17, 34),
                //     scaledSize: new google.maps.Size(25, 25)
                // };
                console.log(place.geometry.location);

                that.addCenter(map, place.geometry.location);
                // Create a marker for each place.

                // that.centerMarker = new google.maps.Marker({
                //     map: map,
                //     icon: icon,
                //     title: place.name,
                //     position: place.geometry.location
                // });

                // markers.push(new google.maps.Marker({
                //     map: map,
                //     icon: icon,
                //     title: place.name,
                //     position: place.geometry.location
                // }));

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
        var that = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position);
                map.setOptions({
                    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    zoom: 12
                });
                that.addCenter(map, new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                // map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            }, function () {
                console.log('can not get position, default is nyc ');
                map.setOptions({
                    center: new google.maps.LatLng(40.6945088, -73.9871052),
                    zoom: 12
                });
                that.addCenter(map, new google.maps.LatLng(40.6945088, -73.9871052));
                // map.setCenter(new google.maps.LatLng(40.6945088, -73.9871052));
            }, { enableHighAccuracy: false, maximumAge: Infinity, timeout: 5000 });
        }
    }
}
