"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaMapLeaf = exports.ShaMapNode = exports.ShaMap = void 0;
const assert_1 = require("assert");
const types_1 = require("./types");
const hash_prefixes_1 = require("./hash-prefixes");
const hashes_1 = require("./hashes");
const buffer_1 = require("buffer/");
/**
 * Abstract class describing a SHAMapNode
 */
class ShaMapNode {
}
exports.ShaMapNode = ShaMapNode;
/**
 * Class describing a Leaf of SHAMap
 */
class ShaMapLeaf extends ShaMapNode {
    constructor(index, item) {
        super();
        this.index = index;
        this.item = item;
    }
    /**
     * @returns true as ShaMapLeaf is a leaf node
     */
    isLeaf() {
        return true;
    }
    /**
     * @returns false as ShaMapLeaf is not an inner node
     */
    isInner() {
        return false;
    }
    /**
     * Get the prefix of the this.item
     *
     * @returns The hash prefix, unless this.item is undefined, then it returns an empty Buffer
     */
    hashPrefix() {
        return this.item === undefined ? buffer_1.Buffer.alloc(0) : this.item.hashPrefix();
    }
    /**
     * Hash the bytes representation of this
     *
     * @returns hash of this.item concatenated with this.index
     */
    hash() {
        const hash = hashes_1.Sha512Half.put(this.hashPrefix());
        this.toBytesSink(hash);
        return hash.finish();
    }
    /**
     * Write the bytes representation of this to a BytesList
     * @param list BytesList to write bytes to
     */
    toBytesSink(list) {
        if (this.item !== undefined) {
            this.item.toBytesSink(list);
        }
        this.index.toBytesSink(list);
    }
}
exports.ShaMapLeaf = ShaMapLeaf;
/**
 * Class defining an Inner Node of a SHAMap
 */
class ShaMapInner extends ShaMapNode {
    constructor(depth = 0) {
        super();
        this.depth = depth;
        this.slotBits = 0;
        this.branches = Array(16);
    }
    /**
     * @returns true as ShaMapInner is an inner node
     */
    isInner() {
        return true;
    }
    /**
     * @returns false as ShaMapInner is not a leaf node
     */
    isLeaf() {
        return false;
    }
    /**
     * Get the hash prefix for this node
     *
     * @returns hash prefix describing an inner node
     */
    hashPrefix() {
        return hash_prefixes_1.HashPrefix.innerNode;
    }
    /**
     * Set a branch of this node to be another node
     *
     * @param slot Slot to add branch to this.branches
     * @param branch Branch to add
     */
    setBranch(slot, branch) {
        this.slotBits = this.slotBits | (1 << slot);
        this.branches[slot] = branch;
    }
    /**
     * @returns true if node is empty
     */
    empty() {
        return this.slotBits === 0;
    }
    /**
     * Compute the hash of this node
     *
     * @returns The hash of this node
     */
    hash() {
        if (this.empty()) {
            return types_1.coreTypes.Hash256.ZERO_256;
        }
        const hash = hashes_1.Sha512Half.put(this.hashPrefix());
        this.toBytesSink(hash);
        return hash.finish();
    }
    /**
     * Writes the bytes representation of this node to a BytesList
     *
     * @param list BytesList to write bytes to
     */
    toBytesSink(list) {
        for (let i = 0; i < this.branches.length; i++) {
            const branch = this.branches[i];
            const hash = branch ? branch.hash() : types_1.coreTypes.Hash256.ZERO_256;
            hash.toBytesSink(list);
        }
    }
    /**
     * Add item to the SHAMap
     *
     * @param index Hash of the index of the item being inserted
     * @param item Item to insert in the map
     * @param leaf Leaf node to insert when branch doesn't exist
     */
    addItem(index, item, leaf) {
        assert_1.strict.ok(index !== undefined);
        if (index !== undefined) {
            const nibble = index.nibblet(this.depth);
            const existing = this.branches[nibble];
            if (existing === undefined) {
                this.setBranch(nibble, leaf || new ShaMapLeaf(index, item));
            }
            else if (existing instanceof ShaMapLeaf) {
                const newInner = new ShaMapInner(this.depth + 1);
                newInner.addItem(existing.index, undefined, existing);
                newInner.addItem(index, item, leaf);
                this.setBranch(nibble, newInner);
            }
            else if (existing instanceof ShaMapInner) {
                existing.addItem(index, item, leaf);
            }
            else {
                throw new Error('invalid ShaMap.addItem call');
            }
        }
    }
}
class ShaMap extends ShaMapInner {
}
exports.ShaMap = ShaMap;
//# sourceMappingURL=shamap.js.map