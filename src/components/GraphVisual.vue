<template>
 <div id="graph">

 </div>
</template>

<script>
import * as d3 from 'd3'
import socketioService from "../../services/socketio.service";
export default {
  name: "GraphVisual",
  data() {
    return {
      svg: null,
      simulation: null,
      nodes: this.graph.nodes,
      links: this.graph.links,
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
    drawGraph() {
      this.simulation = d3.forceSimulation(this.graph.nodes)
        .force(
            'link',
            d3.forceLink().id(d => d.username).links(this.graph.links).distance(150),
        )
        .force('charge', d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX(innerWidth / 4))
        .force("y", d3.forceY(innerHeight / 2))
        .on('tick', ticked)
        .alphaTarget(0)
        .alphaDecay(0.02);

    this.svg = d3.select('#graph')
        .append('svg')
        .attr('width', window.innerWidth / 2)
        .attr('height', window.innerHeight);

    const link = this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.graph.links, d => d.source.username + '-' + d.target.username)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .attr('class', 'link')
        .attr('id', d => `${d.source.username}-${d.target.username}`)
        .style('stroke', 'black')
        .style('opacity', 0.5);

    const nodes = this.svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(this.graph.nodes, d => d.username)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('id', d => d.username)

    nodes.append('circle')
        .attr('r', 20)
        .style('fill', d => d.username === this.username ? 'darkblue' : 'lightblue')
        .style('opacity', d => d.is_active ? '1.0' : '0.5')
        .style('stroke', 'black')

    nodes.append('text').text(d => d.username)
        .style('font-size', 18)
        .attr("dx", 20)

    function ticked() {
      link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
      nodes
          .attr('transform', d => `translate(${d.x},${d.y})`)
      }
    }
  },
  computed: {
    nodesLength() {
      console.log('NODES LENGTH CHANGES')
      return this.graph.nodes.length;
    },
    linksLength() {
      console.log('LINKS LENGTH CHANGES')
      return this.graph.links.length;
    },
    isActive() {
      let activity = []
      for (let n of this.graph.nodes) {
        activity.push(n.is_active)
      }
      return activity
    }
  },
  watch: {
    nodesLength: {handler() {
      console.log('change of nodes in graph')  // update graph here
      this.simulation.stop()
      d3.select('svg').remove()
      this.drawGraph()
      }
    },
    linksLength: {handler() {
        console.log('change of links in graph')  // update graph here
        this.simulation.stop()
        d3.select('svg').remove()
        this.drawGraph()
      }
    },
    isActive: {handler() {
        console.log('change of activity in graph')
        this.simulation.stop()
        d3.select('svg').remove()
        this.drawGraph()
      }
    }
  },
  created() {
    socketioService.socket.on('msg visual', (data) => {
      console.log(data)
      const line = d3.select(`#${data.from}-${data.to}`)
      this.svg.append('line')
          .attr('id', 'animation')
          .attr('x1', line.attr('x1'))
          .attr('y1', line.attr('y1'))
          .attr('x2', line.attr('x1'))
          .attr('y2', line.attr('y1'))
          .style('stroke', 'steelblue')
          .style('stroke-width', '4px')
          .transition()
          .duration(1000)
          .attr('x2', line.attr('x2'))
          .attr('y2', line.attr('y2'))

      setTimeout(function (){
        d3.select('#animation').remove()
      }, 1000)
    })
  },
  mounted() {
    console.log('GRAPH IS MOUNTING', this.graph)
    this.drawGraph()
  },
}


</script>

<style scoped>
path {
  stroke: red;
  stroke-width: 5;
  stroke-linecap: round;
}
</style>