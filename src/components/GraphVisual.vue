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
      simulation: null
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
  methods: {
    updateGraph: null
  },
  computed: {
    nodesLength() {
      return this.graph.nodes.length;
    },
    linksLength() {
      return this.graph.links.length;
    }
  },
  watch: {
    nodesLength: {handler() {
      console.log(this.nodesLength)  // update graph here
        this.updateGraph();
      }
    },
    linksLength: {handler() {
        console.log(this.linksLength)  // update graph here
        this.updateGraph();
      }
    }
  },
  // mounted() {
  //   console.log(this.graph)
  //   this.svg = d3.select('#graph')
  //       .append('svg')
  //       .attr('width', window.innerWidth / 2)
  //       .attr('height', window.innerHeight);
  //
  //   this.simulation = d3.forceSimulation()
  //       .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2).strength(0.01))
  //       .nodes(this.graph.nodes)
  //       .force('link', d3.forceLink(this.graph.links).id(d => d.username).distance(100))
  //       .on('tick', ticked)
  //       .alphaDecay(0.0002)
  //
  //   function ticked() {
  //         this.svg.selectAll('.link')
  //             .attr('x1', d => d.source.x)
  //             .attr('y1', d => d.source.y)
  //             .attr('x2', d => d.target.x)
  //             .attr('y2', d => d.target.y)
  //         this.svg.selectAll('.node')
  //             .attr('cx', d => d.x)
  //             .attr('cy', d => d.y)
  //             .attr('transform', d => `translate(${d.x},${d.y})`)
  //       }
  //
  //   this.updateGraph = function() {
  //     const link = this.svg.selectAll('.link').data(this.graph.links);
  //     link.enter()
  //         .insert('line', '.node')
  //         .attr('class', 'link')
  //         .style('stroke-width', 2)
  //         .attr('id', d => d.source.username + d.target.username)
  //     link.exit().remove()
  //
  //     const node = this.svg.selectAll('.node').data(this.graph.nodes);
  //     const g = node.enter()
  //         .append('g')
  //         .attr('class', 'node');
  //     g.append('circle')
  //         .attr('r', 10)
  //         .style('fill', 'lightblue');
  //     g.append('text')
  //         .attr('class', 'text')
  //         .text(d => d.username);
  //     node.exit().remove();
  //
  //     this.simulation
  //         .nodes(this.graph.nodes)
  //         .force('link', d3.forceLink(this.graph.links).distance(100))
  //         .force('charge', d3.forcceManyBody().strength(-200))
  //         .restart()
  //   }
  //
  //
  // }

  mounted() {
    console.log(this.graph)
    this.simulation = d3.forceSimulation(this.graph.nodes)
        .force(
            'link',
            d3.forceLink().id(d => d.username).links(this.graph.links).distance(150),
        )
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(window.innerWidth / 4, window.innerHeight / 2))
        .on('tick', ticked)
        .alphaDecay(0.0002);

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
        .attr('class', 'link')
        .attr('id', d => `${d.source.username}${d.target.username}`)
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

    this.updateGraph = function () {
      console.log(this.graph)
      const link = this.svg.select('.links')
          .selectAll('.link')
          .data(this.graph.links);
      link.enter()
          //.insert('line', '.node')  //  ???
          .append('line')
          .attr('class', 'link')
          .attr('stroke-width', 2)
          .attr('id', d => `${d.source.username}${d.target.username}`)//d.source.username + d.target.username)
          .style('stroke', 'black');
      link.exit().remove();

      const node = this.svg.select('.nodes')
          .selectAll('.node')
          .data(this.graph.nodes);
      const g = node.enter().append('g')
          .attr('class', 'node');
      g.append('circle')
          .attr('r', 15)
          .attr('id', d => d.username)
          .style('fill', d => d.username === this.username ? 'darkblue' : 'lightblue')
          .style('opacity', d => d.is_active ? '1.0' : '0.5')
          .style('stroke', 'black');
      g.append('text')
          .attr('class', 'text')
          .text(d => d.username);
      node.exit().remove();

      this.simulation.nodes(this.graph.nodes)
          .force('link', d3.forceLink().id(d => d.username).links(this.graph.links).distance(150))
          .force('charge', d3.forceManyBody().strength(-200))
          .restart();  //was trying to add ticked function - did not help
    }
  },
  // watch: {
  //   graph: {
  //     deep: true,
  //     handler() {
  //
  //       const links = this.svg.select('.links').selectAll('line').data(this.graph.links);
  //
  //       links.enter().append('line')
  //           .attr('class', 'link')
  //           .attr('stroke-width', 2)
  //           .attr('id', d => d.source.username + d.target.username)
  //           .style('stroke', 'black');
  //
  //       links.exit().remove();
  //
  //
  //       const nodes = this.svg.select('.nodes')
  //           .selectAll('.node')
  //           .data(this.graph.nodes);
  //
  //       const enterSelection = nodes.enter().append('g')
  //           .attr('class', 'node');
  //
  //       enterSelection.append('circle')
  //           .attr('r', 15)
  //           .style('fill', 'lightblue')
  //           .style('fill', d => d.username === this.username ? 'darkblue' : 'lightblue')
  //           .style('opacity', d => d.is_active ? '1.0' : '0.5')
  //           .style('stroke', 'black');
  //
  //       enterSelection.append('text')
  //           .text(d => d.username);
  //
  //       nodes.exit().remove();
  //
  //       this.simulation.nodes(this.graph.nodes);
  //       this.simulation.force('link').links(this.graph.links).distance(150);
  //       this.simulation.alphaTarget(0.01).restart();
  //     }
  //   }
  // }
}


</script>

<style scoped>

</style>