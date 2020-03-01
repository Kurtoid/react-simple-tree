import React, { useRef } from 'react';
import './tree.css'
import { DndProvider, useDrop } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import { ItemTypes } from '../Constants'
import { useDrag } from 'react-dnd'
function getNodeById(id, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            return data[i]
        }
    }
    return null
}
function NodeLabel(props) {
    const ref = useRef(null)
    const handleNodeClick = () => {
        const { onClick, node } = props
        onClick(node.id)
    }
    const { node, subNodes } = props
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.NodeLabel, nodeId: node.id },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    const [, drop] = useDrop({
        accept: ItemTypes.NodeLabel,
        drop(item, monitor) {
            if (!ref.current) {
                return
            }
            let droppedNode = getNodeById(item.nodeId, props.data);
            console.log("dropped " + droppedNode.id + " on " + node.id)
            if (!droppedNode) {
                return
            }
            if (item.nodeId === node.id || droppedNode.parent === null) {
                return
            }
            droppedNode.parent = node.id
            node.collapsed = false

            props.onChange(props.data)
        }
    })

    let bullet = ">"
    if (node.collapsed || subNodes === undefined) {
        bullet = "*";
    }
    if (node.id !== null) {
        drag(drop(ref))
    }
    return (
        <li >
            <div ref={ref} onClick={handleNodeClick}>{bullet} {node.name}</div>
            {subNodes}
        </li>
    )
}
class SimpleTree extends React.Component {
    constructor(props) {
        super(props);
        const { data, onChange } = props
        data.forEach((node) => {
            if (node.collapsed === undefined) {
                node.collapsed = false
            }
        })
        onChange(data)
        this.handleNodeClick = this.handleNodeClick.bind(this)
    }
    getRootNode() {
        const { data } = this.props;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parent == null) {
                return data[i];
            }
        }
        return null;
    }
    getChildren(node) {
        const { data } = this.props;
        let ret = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].parent === node.id) {
                ret.push(data[i]);
            }
        }
        return ret;
    }
    handleNodeClick(nodeId) {
        const { data } = this.props
        let node = null
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === nodeId) {
                node = data[i]
            }
        }
        if (node === null) {
            return
        }
        if (node.collapsed === undefined) {
            node.collapsed = true;
        } else {
            node.collapsed = !node.collapsed
        }
        this.props.onChange(data)
    }
    renderNode(node) {
        let children = this.getChildren(node)
        let rows = []
        for (let i = 0; i < children.length; i++) {
            rows.push(this.renderNode(children[i]))
        }
        let subNodes;
        if (rows.length > 0 && !node.collapsed) {
            subNodes = <ul>{rows}</ul>
        }
        return (
            <NodeLabel onChange={this.props.onChange} data={this.props.data} node={node} key={node.id} subNodes={subNodes} onClick={this.handleNodeClick} />
        )
    }
    render() {
        return (
            <DndProvider backend={Backend}>
                <div>
                    <ul>
                        {this.renderNode(this.getRootNode())}
                    </ul>
                </div>
            </DndProvider>
        )
    }
}

export default SimpleTree