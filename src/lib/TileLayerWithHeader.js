// https://github.com/Leaflet/Leaflet/issues/2091#issuecomment-1892557572
import { GridLayer } from "react-leaflet";
import { withLeaflet } from "react-leaflet";
import { TileLayer as LeafletTileLayer } from 'leaflet'

async function fetchImage(url, callback, headers, abort) {
  const controller = new AbortController();
  const signal = controller.signal;
  if (abort) {
    abort.subscribe(() => {
      controller.abort();
    });
  }
  const f = await fetch(url, {
    method: "GET",
    headers: headers,
    mode: "cors",
    signal: signal
  });
  const blob = await f.blob();
  callback(blob);
}

const LTileLayerWithHeader = LeafletTileLayer.extend({
  initialize: function (url, options) {
    const { headers, abort, results, ...props } = options;
    LeafletTileLayer.prototype.initialize.call(this, url, props);
    this.headers = headers;
    this.abort = abort;
    this.results = results;
  },
  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement("img");
    img.setAttribute("role", "presentation");

    fetchImage(
      url,
      resp => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          if (this.results) {
            this.results.next(reader.result);
          };
        };
        reader.readAsDataURL(resp);
        done(null, img);
      },
      this.headers,
      this.abort
    );
    return img;
  }
});

class TileLayerWithHeader extends GridLayer {
  componentDidMount(...attributes) {
    super.componentDidMount(...attributes);
  }

  createLeafletElement(props) {
    return new LTileLayerWithHeader(props.url, this.getOptions(props));
  }

  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement("img");
    img.setAttribute("role", "presentation");

    fetchImage(
      url,
      resp => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          if (this.results) {
            this.results.next(reader.result);
          };
        };
        reader.readAsDataURL(resp);
        done(null, img);
      },
      this.headers,
      this.abort
    );
    return img;
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    if (toProps.url !== fromProps.url) {
      this.leafletElement.setUrl(toProps.url);
    }
  }
}

export default withLeaflet(TileLayerWithHeader);
