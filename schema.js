const typeDefs = `
type ConceptNode{
    id:ID
    extents:[String]!
    intents:[String]!
    isSup:Boolean
    isInf:Boolean
    children:[ConceptNode]@relation(name: "CHILD", direction: "OUT")
    parents:[ConceptNode]@relation(name: "CHILD", direction: "IN")
}

type Query{
    ConceptNode(
        id:ID
        extents:[String]
        intents:[String]
        isSup:Boolean
        isInf:Boolean
    ):[ConceptNode]
}

type Mutation{
    CreateConceptNode(
        id:ID
        extents:[String]!
        intents:[String]!
        isSup:Boolean
        isInf:Boolean
    ):ConceptNode

    DeleteConceptNode(
        id:ID!
    ):ConceptNode

    MergeConceptNode(
        id:ID!
        extents:[String]
        intents:[String]
        isSup:Boolean
        isInf:Boolean
    ):ConceptNode

    AddChild(fromID: ID, toID: ID): ConceptNode
    @cypher(
        statement:"""
        MATCH (from:ConceptNode),(to:ConceptNode)
        WHERE from.id=$fromID and to.id=$toID
        CREATE (from)-[r:CHILD]->(to)
        RETURN to
          """
    )

    RemoveChild(fromID:ID,toID:ID): ConceptNode
    @cypher(
        statement:"""
        MATCH (from:ConceptNode)-[r:CHILD]->(to:ConceptNode)
        WHERE from.id=$fromID and to.id=$toID
        DELETE r
          """
    )
}

`;

module.exports = typeDefs;