
import React, { useState } from 'react'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'




function Wellcome() {

  return (
    <Container maxWidth="sm">
      <Paper>
        <div className="intro alignCenter">
          <p className="text mediumPadding">Es ist ein Anfang</p>
        </div>
        </Paper>
    </Container>
  );

}

export default Wellcome;
