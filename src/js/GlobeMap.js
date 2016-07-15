import CoordinateMaping from './components/CoordinateMaping';

export default class GlobeMap extends CoordinateMaping {

  init() {
    const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', () => this.zoomed());

    this.drawingArea.element
        .insert('image',':first-child')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', this.drawingArea.width)
          .attr('height', this.drawingArea.height)
          .attr('xlink:href', '../assets/worldHigh.svg');
    this.svg.call(zoom);

	// projection="mercator" 
  // leftLongitude="-169.110266" 
  // rightLongitude="190.480712" 
  // topLatitude="83.63001" 
  // bottomLatitude="-58.488473"

    this.projection = d3.geoMercator()
              .translate([this.width/2, this.height/2]);
  }
  postprocessData(data) {
    // Expecting data in form of array [latitude , longitude]
    data = [[0,0], [9.68726, 47.3655056]];

    data = data.map(d => this.projection(d));

    return data;
  }
  drawGraph() {
    this.createGraph(this.dataGroup);
  }
  itemsEnter(items) {
    return items.append('circle')
           .attr('r', 10)
           .attr('cx', d => d[0])
           .attr('cy', d => d[1])
           .attr('class', 'dataItem')
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut());
  }
  zoomed() {
    this.drawingArea.element.attr('transform', d3.event.transform);
  }
}
