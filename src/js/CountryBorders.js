import ForceDirectedGraph from './components/ForceDirectedGraph';

export default class CountryBorders extends ForceDirectedGraph {
   postprocessData(data) {
    // Expecting data in form of 2 arrays: nodes[id] and array links[source-id,target-id]
     this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d, i) => i))
      .force('charge', d3.forceManyBody().distanceMax(500).distanceMin(100).strength(-4))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .velocityDecay(0.4);
     return data;
   }
   createGraph(parentElement) {
     const linksGroup = parentElement.append('g').attr('class', 'links');
     const itemsLinks = linksGroup.selectAll('dataLine').data(this.data.links);
     this.itemsExit(itemsLinks.exit(), false);
     this.links = this.itemsEnter(itemsLinks.enter(), false);
     this.itemsUpdate(itemsLinks, false);

     const nodesGroup = d3.select('.flagContainer');
     const itemsNodes = nodesGroup.selectAll('.flag').data(this.data.nodes);
     this.itemsExit(itemsNodes.exit(), true);
     this.nodes = this.itemsEnter(itemsNodes.enter(), true);
     this.itemsUpdate(itemsNodes, true);

     this.simulation
      .nodes(this.data.nodes)
      .on('tick', () => this.tick())
      .force('link')
      .links(this.data.links);
   }

   itemsEnter(items, isNode) {
     if (isNode) {
       const flag = items.append('img')
           .attr('class', d => `flag flag-${d.code}`)
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut())
           .call(d3.drag()
            .on('start', d => this.dragstarted(d))
            .on('drag', d => this.dragged(d))
            .on('end', d => this.dragended(d)));
       return flag;
     }
     return super.itemsEnter(items, isNode);
   }
   tick() {
     this.links
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
     this.nodes
            .style('left', d => `${d.x - 8}px`)
            .style('top', d => `${d.y - 5}px`);
   }
  tooltipSetContent(dataItem) {
    return dataItem.country;
  }
}
