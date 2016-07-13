import CoordinateMaping from './components/CoordinateMaping';

export default class GlobeMap extends CoordinateMaping {
  constructor(parentElement, config, APIKey, callback) {
    super(parentElement, config, callback);
  }
}
