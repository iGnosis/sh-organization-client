import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from '../../../environments/environment';
import { JwtService } from '../jwt/jwt.service';
@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  public client: GraphQLClient;
  public publicClient: GraphQLClient;

  constructor(private jwtService: JwtService) {
    const additionalHeaders: any = {
      'x-pointmotion-user-type': 'staff',
    };
    if (environment.name == 'local') {
      additionalHeaders['x-pointmotion-debug'] = 'true';
    }

    this.client = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign(
        {
          Authorization: 'Bearer ' + this.jwtService.getToken(),
        },
        additionalHeaders
      ),
    });

    this.publicClient = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign({}, additionalHeaders),
    });

    this.jwtService.watchToken().subscribe((token: string) => {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign(
          {
            Authorization: 'Bearer ' + token,
          },
          additionalHeaders
        ),
      });
    });
  }

  async gqlRequest(
    query: string,
    variables: any = {},
    auth = true,
    additionalHeaders: any = {}
  ) {
    additionalHeaders['x-pointmotion-user-type'] = 'staff';
    additionalHeaders['x-organization-name'] = environment.organizationName;

    if (environment.name == 'local') {
      additionalHeaders['x-pointmotion-debug'] = 'true';
    }

    // make authenticated request.
    if (auth) {
      const token = this.jwtService.getToken();
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign({
          Authorization: 'Bearer ' + token,
          ...additionalHeaders,
        }),
      });
    } else {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: {
          ...additionalHeaders,
        },
      });
    }

    try {
      return await this.client.request(query, variables);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

function _getItem(key: string) {
  const value = localStorage.getItem(key);
  console.log('_getItem:key:value -', key, value);
  return value;
}
