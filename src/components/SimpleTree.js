import React from 'react';
import './tree.css'
class NodeLabel extends React.Component {
    constructor(props) {
        super(props)
        this.handleNodeClick = this.handleNodeClick.bind(this)
    }
    handleNodeClick() {
        const { onClick, node } = this.props
        onClick(node.id)
    }
    render() {
        const { node, subNodes } = this.props
        let bullet = ">"
        if (node.collapsed || subNodes === undefined) {
            bullet = "*";
        }
        return (
            <li key={node.id} >
                <div onClick={this.handleNodeClick}>{bullet} {node.name}</div>
                {subNodes}
            </li>
        )

    }
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
        console.log(nodeId)
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
            <NodeLabel node={node} subNodes={subNodes} onClick={this.handleNodeClick} />
        )
    }
    render() {
        const { data } = this.props;
        return (
            <div>
                <ul>
                    {this.renderNode(this.getRootNode())}
                </ul>
            </div>
        )
    }
}

export default SimpleTree