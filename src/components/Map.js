import React from 'react';
import { Map as LeafletMap } from 'react-leaflet'
import './Map.css';
import TileLayerWithHeader from '../lib/TileLayerWithHeader';

export const Map = () => {
  // 緯度軽度
  const position = [51.505, -0.09];
  // 初期マップズームレベル
  const zoom = 13;
  return (
    <LeafletMap center={position} zoom={zoom}>
      <TileLayerWithHeader
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        headers={{ Authorization: "Bearer 1234567890" }}
      />
    </LeafletMap>
  )
};
