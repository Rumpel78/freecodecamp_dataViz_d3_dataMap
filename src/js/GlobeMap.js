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
    this.projection = d3.geoMercator().translate([this.width/2, this.height/2]);
    console.log(this.projection);
  }
  postprocessData(data) {
    // Expecting data in form of array [latitude , longitude]
    data = [[0,0], [47.3655056,9.68726]];

    const minX = -169.110266;
    const maxX = 190.480712;

    const minY = 83.63001;
    const maxY = -58.488473;

    data = data.map(d => this.projection(d));
    console.log(data);

    this.scaleX = d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([0, this.drawingArea.width]);
    this.scaleY = d3.scaleLinear()
                    .domain([minY, maxY])
                    .range([0, this.drawingArea.height]);
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
