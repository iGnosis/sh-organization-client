import { Injectable } from '@angular/core';
import { GraphQLClient } from 'graphql-request';
import { environment } from '../../../environments/environment';
import { JwtService } from '../jwt/jwt.service';
@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  public client: GraphQLClient;
  private additionalHeaders: {[key: string]: any} = {
    'x-pointmotion-user-type': 'staff',
    'x-organization-name': environment.organizationName
  }

  constructor(private jwtService: JwtService) {
    if (environment.name == 'local') {
      this.additionalHeaders['x-pointmotion-debug'] = 'true';
    }

    this.client = new GraphQLClient(environment.gqlEndpoint, {
      headers: Object.assign(
        {
          Authorization: 'Bearer ' + this.jwtService.getToken(),
        },
        this.additionalHeaders
      ),
    });

    this.jwtService.watchToken().subscribe((token: string) => {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign(
          {
            Authorization: 'Bearer ' + token,
          },
          this.additionalHeaders
        ),
      });
    });
  }

  async gqlRequest(
    query: string,
    variables: any = {},
    auth = true,
    additionalHeaders: {[key: string]: any} = {}
  ) {

    for (const [key, value] of Object.entries(additionalHeaders)) {
      this.additionalHeaders[key] = value;
    }

    // make authenticated request.
    if (auth) {
      const token = this.jwtService.getToken();
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: Object.assign({
          Authorization: 'Bearer ' + token,
          ...this.additionalHeaders,
        }),
      });
    } else {
      this.client = new GraphQLClient(environment.gqlEndpoint, {
        headers: {
          ...this.additionalHeaders,
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
