import gql from 'graphql-tag';

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`

export const SAVE_BOOK = gql`
  mutation saveBook($input: savedBook!){
    saveBook(input: $input){
      savedBooks{
        bookId
        title 
        authors
      }
    }
  }
`

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String){
      removeBook(bookId: $bookId){
        savedBooks {
          bookId
          title
        }
      }
  }
`