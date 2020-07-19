import {
  HouseResolvers,
  QueryResolvers,
  Person,
  Query,
} from "../../generated/graphql/types";
import {
  House as HouseGraphQL,
  Person as PersonGraphql,
} from "../../generated/graphql/types";
import { GraphQLResolveInfo } from "graphql";
import { allHouse, allPeople } from "../../database/fake";
import { House as HouseGrpc } from "../../generated/grpcServer/house_pb";
import { Person as PersonGrpc } from "../../generated/grpcServer/person_pb";
export const houseresolver: {
  House: HouseResolvers;
  Query: QueryResolvers;
} = {
  Query: {
    houses: async (
      source: Partial<Query>,
      args: {},
      context: any,
      info: GraphQLResolveInfo
    ): Promise<HouseGraphQL[]> => {
      return allHouse.map((h: HouseGrpc.AsObject) => {
        return {
          id: h.id?.value ?? -1,
          address: {
            streetname: h.address?.streetname?.value ?? "",
            housenumber: h.address?.housenumber?.value ?? "",
          },
          numberOfBedrooms: h.numberofbedrooms?.value ?? 0,
          onSale: h.onsale?.value ?? false,
          squarefeet: h.squarefeet?.value ?? 0,
          isRental: h.isrental?.value ?? false,
          Owner: { id: h.ownerid?.value } as Person,
        };
      });
    },
  },
  House: {
    Owner: async (
      source: Partial<HouseGraphQL>,
      args: {},
      context: any,
      info: GraphQLResolveInfo
    ): Promise<PersonGraphql> => {
      const ownerObj: PersonGrpc.AsObject | undefined = allPeople.find(
        (d) => d.id?.value === source.Owner?.id
      );
      if (ownerObj === undefined) {
        return { id: 324, firstname: "Bank", lastname: "", fullname: "" };
      }
      return {
        id: ownerObj.id?.value ?? 100,
        firstname: ownerObj.firstname?.value ?? "",
        lastname: ownerObj.lastname?.value ?? "",
        fullname: ownerObj.firstname + "" + ownerObj?.lastname,
      };
    },
  },
};

export default houseresolver;
