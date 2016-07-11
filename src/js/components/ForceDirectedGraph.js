import SvgCanvas from './SvgCanvas';

export default class ForceDirectedGraph extends SvgCanvas {
  postprocessData(data) {
    // Expecting data in form of 2 arrays: nodes[id] and array links[source-id,target-id]
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));
    return data;
  }

  createGraph(parentElement) {
    const linksGroup = parentElement.append('g').attr('class', 'links');
    const itemsLinks = linksGroup.selectAll('dataLine').data(this.data.links);
    this.itemsExit(itemsLinks.exit(), false);
    this.links = this.itemsEnter(itemsLinks.enter(), false);
    this.itemsUpdate(itemsLinks, false);

    const nodesGroup = parentElement.append('g').attr('class', 'nodes');
    const itemsNodes = nodesGroup.selectAll('dataNode').data(this.data.nodes);
    this.itemsExit(itemsNodes.exit(), true);
    this.nodes = this.itemsEnter(itemsNodes.enter(), true);
    this.itemsUpdate(itemsNodes, true);

    this.simulation
      .nodes(this.data.nodes)
      .on('tick', () => this.tick())
      .force('link')
      .links(this.data.links);
  }
  tick() {
    this.links
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
    this.nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  drawGraph() {
    this.createGraph(this.dataGroup);
  }

  itemsEnter(items, isNode) {
    if (isNode) {
      return items.append('circle')
           .attr('class', 'dataNode')
           .attr('r', 5)
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut())
           .call(d3.drag()
            .on('start', d => this.dragstarted(d))
            .on('drag', d => this.dragged(d))
            .on('end', d => this.dragended(d)));
    }
    return items.append('line')
           .attr('class', 'dataLine')
           .attr('stroke-width', 1);
  }

  tooltipSetContent(dataItem) {
    return dataItem.id;
  }
}
