/* eslint no-unused-vars: 0 */

import Visualization from './CountryBorders';
import config from './config';


const visualization = new Visualization('.plot', config, v => {
  d3.select('.flagContainer')
    .style('width', `${config.canvasWidth}px`)
    .style('height', `${config.canvasHeight}px`);
    
  v.getData(config.dataUrl, (err, data) => {
    v.drawGraph();
  });
});
