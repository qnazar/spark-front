<template>
 <div id="graph">

 </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "GraphVisual",
  data() {
    return {
      svg: null,
      simulation: null,
      links: null,
      nodes: null
    }
  },
  props: {
    graph: {
      type: Object
    },
    username: {
      type: String
    }
  },
  mounted() {
    this.simulation = d3.forceSimulation(this.graph.nodes)
        .force(
            'link',
            d3.forceLink().id(d => d.username).links(this.graph.links).distance(150),
        )
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(window.innerWidth / 4, window.innerHeight / 2))
        .alphaTarget(0)
        .on('tick', ticked);

    this.svg = d3.select('#graph')
        .append('svg')
        .attr('width', window.innerWidth / 2)
        .attr('height', window.innerHeight);

    const link = this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.graph.links)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .attr('id', d => d.source.username + d.target.username)
        .style('stroke', 'black');

    const nodes = this.svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(this.graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')

    nodes.append('circle')
        .attr('r', 15)
        .attr('id', d => d.username)
        .style('fill', d => d.username === this.username ? 'darkblue' : 'lightblue')
        .style('opacity', d => d.is_active ? '1.0' : '0.5')
        .style('stroke', 'black')

    nodes.append('text').text(d => d.username)

    function ticked() {
      link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
      nodes
          .attr('transform', d => `translate(${d.x},${d.y})`)
    }
  },
  watch: {
    graph: {
      deep: true,
      handler() {

        const links = this.svg.select('.links').selectAll('line').data(this.graph.links);

        links.enter().append('line')
            .attr('class', 'link')
            .attr('stroke-width', 2)
            .attr('id', d => d.source.username + d.target.username)
            .style('stroke', 'black');

        links.exit().remove();


        const nodes = this.svg.select('.nodes')
            .selectAll('.node')
            .data(this.graph.nodes);

        const enterSelection = nodes.enter().append('g')
            .attr('class', 'node');

        enterSelection.append('circle')
            .attr('r', 15)
            .style('fill', 'lightblue')
            .style('fill', d => d.username === this.username ? 'darkblue' : 'lightblue')
            .style('opacity', d => d.is_active ? '1.0' : '0.5')
            .style('stroke', 'black');

        enterSelection.append('text')
            .text(d => d.username);

        nodes.exit().remove();

        this.simulation.nodes(this.graph.nodes);
        this.simulation.force('link').links(this.graph.links).distance(150);
        this.simulation.alphaTarget(0.01).restart();
      }
    }
  }
}


</script>

<style scoped>

</style>