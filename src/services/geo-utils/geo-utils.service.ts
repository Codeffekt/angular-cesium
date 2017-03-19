import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
declare var Cesium;

@Injectable()
export class GeoUtilsService {

	constructor(private cesiumService: CesiumService) {
	}

	pointByLocationDistanceAndAzimuth(currentLocation, meterDistance, radianAzimuth, isInputCartesian = false) {
		let distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
		let curLat = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).latitude : currentLocation.latitude;
		let curLon = isInputCartesian ? Cesium.Cartographic.fromCartesian(currentLocation).longitude : currentLocation.longitude;

		let destinationLat = Math.asin(
			Math.sin(curLat) * Math.cos(distance) +
			Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth)
		);

		let destinationLon = curLon + Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat),
				Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat)
			);

		destinationLon = (destinationLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

		return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
	}

	screenPositionToCartesian3(screenPos: {x: number, y: number}) {
		const camera = this.cesiumService.getViewer().camera;
		return camera.pickEllipsoid(screenPos);
	}
}