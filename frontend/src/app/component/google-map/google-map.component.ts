import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { UserService } from '../../service';
import { Hotel } from '../../constant';
import { environment } from '../../../environments/environment.prod';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
    chosenMarker: any;
    tagItems: { [tag: string]: Hotel[] } = {};
    tags: string[] = [];
    bookHotelName: string;
    closeResult: string;
    rating = 3.5;

    constructor(
        private userServie: UserService,
        private modalService: NgbModal) { }

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
        if (tag != 'All') {
            this.userServie.getToken(token => {
                console.log(token);
                this.userServie.clickTag(token, [tag]).subscribe(res => {
                    console.log(`click tag resp: ${res}`);
                });
            });
        }

        this.filter(tag == 'All' ? false : true, tag);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    bookHotel(content, hotel: Hotel) {
        // console.log(`book ${hotel}`);
        this.bookHotelName = hotel.name;
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(`Closed with: ${result}`);
            if (result == 'Confirm') {
                console.log('confirmed');
                this.userServie.getToken(token => {
                    console.log(token);
                    this.userServie.clickTag(token, hotel.tags).subscribe(res => {
                        console.log(`click tag resp: ${res}`);
                    });
                });
            }

        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(`Dismissed ${this.getDismissReason(reason)}`);

        });

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
            let marker: any = new google.maps.Marker({
                map: this.myMap,
                title: hotel.name,
                position: new google.maps.LatLng(hotel.lat, hotel.lng),
                animation: google.maps.Animation.DROP
            })

            hotel.marker = marker;

            console.log(hotel);

            marker.infowindow = new google.maps.InfoWindow({
                content: `${hotel.name}`
                // content: hotel.desc
            });

            marker.addListener('click', function () {
                if (that.chosenMarker) {
                    that.chosenMarker.infowindow.close();
                }
                that.chosenMarker = marker;
                marker.infowindow.open(that.myMap, marker);
                that.myMap.setOptions({
                    center: new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()),
                    zoom: 12
                });
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    marker.setAnimation(null);
                }, 1000);

            });

        });
    }

    clickHotel(hotel: Hotel) {
        console.log(hotel);
        new google.maps.event.trigger(hotel.marker, 'click');
    }

    search() {
        if (this.myMap.centerMarker === undefined) {
            alert('choose you location first');
            return
        }

        let text = (<HTMLInputElement>document.getElementById("inputTag")).value;
        console.log(`text is ${text}`);

        // recommend hotel by user's history
        if (text == '') {
            this.recommend();
        } else { // search by tag
            this.searchByTag(text);
        }
    }

    searchByTag(tag: string) {
        this.userServie.getToken(token => {
            console.log(token);
            
            this.userServie.getTagHotels(token, tag).
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

    recommend() {
        const position = this.myMap.centerMarker.getPosition();

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

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                console.log(place);

                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                console.log(place.geometry.location);

                that.addCenter(map, place.geometry.location);

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
