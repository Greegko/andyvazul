import React from "react";
import { Layout } from "../components/layout";

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <div>Following text in Stern: THE BROWN FOX JUMPS OVER THE LAZY DOG</div>
    <span style={{ fontFamily: 'Stern', fontSize: 200, letterSpacing: -100 }}>THE BROWN FOX JUMPS OVER THE LAZY DOG</span>
  </Layout >
)

export default IndexPage
