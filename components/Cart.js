import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import User from './User';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';


// Local State Query:
const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client,
    # @client tells apollo this data from local store --  not in remote/db.
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;


const Cart = () => {
  return (
    <User>
      {({ data: { me } }) => {
        if (!me) return null;
        console.log(me);
        return (

          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => (

              <Query query={LOCAL_STATE_QUERY}>

                {/* destructures data from query: */}
                {({ data }) => (
                  console.log('🛒', data) || (

                    <CartStyles
                      // accessing the cartOpen property defined in withData.js for clientState
                      open={data.cartOpen}
                    >
                      <header>
                        <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                        <Supreme>{me.name}'s Cart</Supreme>
                        <p>You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart.</p>

                      </header>
                      <ul>
                        {me.cart.map((cartItem) =>
                          <CartItem
                            key={cartItem.id}
                            cartItem={cartItem}
                          />
                        )}
                      </ul>
                      <footer>
                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                        {/* takes in the entire cart and returns total */}
                        <SickButton>Checkout</SickButton>
                      </footer>
                    </CartStyles>

                  )
                )}
              </Query>


            )}
          </Mutation>

        )
      }}
    </User>
  )
}

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }