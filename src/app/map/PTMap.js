/**
 * Map taken and changed from here: https://github.com/alex3165/react-leaflet-draw/blob/HEAD/example/edit-control.js
 */

import React, { Component } from 'react';
import { Map, TileLayer, Circle, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { EditControl } from 'react-leaflet-draw';

// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

//

let polyline;

export default class EditControlExample extends Component {

  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  _onEdited = (e) => {

    let numEdited = 0;
    e.layers.eachLayer( (layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    this._onChange();
  }

  _onCreated = (e) => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === 'marker') {
      // Do marker specific actions
      console.log("_onCreated: marker created", e);
    }
    else {
      console.log("_onCreated: something else created:", type, e);
      this.props.onRouteChanged(layer.editing.latlngs)
    }
    // Do whatever else you need to. (save to db; etc)

    this._onChange();
  }

  _onDeleted = (e) => {

    let numDeleted = 0;
    e.layers.eachLayer( (layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);

    this._onChange();
  }

  _onMounted = (drawControl) => {
    console.log('_onMounted', drawControl);
  }

  _onEditStart = (e) => {
    console.log('_onEditStart', e);
  }

  _onEditStop = (e) => {
    console.log('_onEditStop', e);
  }

  _onDeleteStart = (e) => {
    console.log('_onDeleteStart', e);
  }

  _onDeleteStop = (e) => {
    console.log('_onDeleteStop', e);
  }

  render() {
    return (
      <Map center={[52.530644, 13.383068]} zoom={18} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={ (reactFGref) => {this._onFeatureGroupReady(reactFGref);} }>
          <EditControl
            position='topright'
            onEdited={this._onEdited}
            onCreated={this._onCreated}
            onDeleted={this._onDeleted}
            onMounted={this._onMounted}
            onEditStart={this._onEditStart}
            onEditStop={this._onEditStop}
            onDeleteStart={this._onDeleteStart}
            onDeleteStop={this._onDeleteStop}
            draw={{
              rectangle: false,
              polygon: false,
              circle: false,
              marker: false,
              circleMarker: false
            }}
          />
        </FeatureGroup>
      </Map>
    );
  }

  _editableFG = null

  _onFeatureGroupReady = (reactFGref) => {
    if (!reactFGref) {
      return
    }

    // populate the leaflet FeatureGroup with the geoJson layers

    let leafletGeoJSON = new L.GeoJSON(getGeoJson());
    let leafletFG = reactFGref.leafletElement;

    leafletGeoJSON.eachLayer( (layer) => {
      leafletFG.addLayer(layer);
    });

    // store the ref for future access to content

    this._editableFG = reactFGref;
  }

  _onChange = () => {

    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

    const { onChange } = this.props;

    if (!this._editableFG || !onChange) {
      return;
    }

    const geojsonData = this._editableFG.leafletElement.toGeoJSON();
    onChange(geojsonData);
  }
}


function getGeoJson() {
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
          //   [
          //     -122.47979164123535,
          //     37.830124319877235
          //   ],
          //   [
          //     -122.47721672058105,
          //     37.809377088502615
          //   ]
          ]
        }
      },
    ]
  }
}