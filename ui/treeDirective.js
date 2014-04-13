angular.module('rs-proof')
  .directive('tree', function ($timeout) {
     return {
       restrict: 'A',
       template: '<div class="tree"></div>',
       scope: {
         tree: '=treeData'
       },
       link: function (scope, element) {
         function visit(parent, visitFn, childrenFn)
         {
           if (!parent) return;

           visitFn(parent);

           var children = childrenFn(parent);
           if (children) {
             var count = children.length;
             for (var i = 0; i < count; i++) {
               visit(children[i], visitFn, childrenFn);
             }
           }
         }

         function buildTree(treeData, element, customOptions)
         {
           // build the options object
           var options = $.extend({
             nodeRadius: 10, fontSize: 9
           }, customOptions);


           // Calculate total nodes, max label length
           var totalNodes = 0;
           var maxLabelLength = 0;
           visit(treeData, function(d)
           {
             totalNodes++;
             maxLabelLength = Math.max(d.toString().length, maxLabelLength);
           }, function(d)
           {
             if (!d.hasChildren()) {
               return null;
             }

             var children = [];

             if (d.hasLeftChild()){
               children.push(d.getLeftChild());
             }

             if (d.hasRightChild()){
               children.push(d.getRightChild());
             }

             return children;

           });

           // size of the diagram
           var size = { width:$(element).outerWidth(), height: totalNodes * 15};

           var tree = d3.layout.tree()
             .sort(null)
             .size([size.height, size.width - maxLabelLength*options.fontSize])
             .children(function(d)
             {
               if (!d.hasChildren()) {
                 return null;
               }

               var children = [];

               if (d.hasLeftChild()){
                 children.push(d.getLeftChild());
               }

               if (d.hasRightChild()){
                 children.push(d.getRightChild());
               }

               return children;
             });

           var nodes = tree.nodes(treeData);
           var links = tree.links(nodes);

           d3.select(element).select('svg').remove();


           var svg = d3.select(element)
             .append("svg:svg").attr("width", size.width).attr("height", size.height).append("svg:g");

           /*
            <svg>
            <g class="container" />
            </svg>
            */
           var layoutRoot = svg.append("svg:g")
             .attr("class", "container")
             .attr("transform", "translate(" + maxLabelLength*options.fontSize + ",0)");


           // Edges between nodes as a <path class="link" />
           var link = d3.svg.diagonal()
             .projection(function(d)
             {
               return [d.y, d.x];
             });

           layoutRoot.selectAll("path.link")
             .data(links)
             .enter()
             .append("svg:path")
             .attr("class", "link")
             .attr("d", link);


           /*
            Nodes as
            <g class="node">
            <circle class="node-dot" />
            <text />
            </g>
            */
           var nodeGroup = layoutRoot.selectAll("g.node")
             .data(nodes)
             .enter()
             .append("svg:g")
             .attr("class", "node")
             .attr("transform", function(d)
             {
               return "translate(" + d.y + "," + d.x + ")";
             });

           nodeGroup.append("svg:circle")
             .attr("class", function (d) {
               return d.hasChildren() || d.isFundamental() ? "node-dot" : "node-dot leave"
             })
             .attr("r", options.nodeRadius);

           nodeGroup.append("svg:text")
             .attr("text-anchor", function(d)
             {
               return d.hasChildren() ? "end" : "start";
             })
             .attr("dx", function(d)
             {
               var gap = 2 * options.nodeRadius;
               return d.hasChildren() ? -gap : gap;
             })
             .attr("dy", 3)
             .text(function(d)
             {
               return d.toString();
             });


           svg.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));

           function zoom() {
             var transX = d3.event.translate[0] + maxLabelLength*options.fontSize*0.8;
             var transY = d3.event.translate[1];
             layoutRoot.attr("transform", "translate(" + transX + ',' + 0 + ")");
           }
         }

         scope.$watch('tree', function (tree) {
          if (tree) {
            $timeout(function () {
              buildTree(scope.tree.getRoot(), element[0]);
            })
          }
         });
       }
     }
  });