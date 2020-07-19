import { GraphQLResolveInfo } from "graphql";
import { allPeople, allHouse } from "../../database/fake";
import {
  Person as PersonGraphql,
  House as HouseGraphql,
  PersonResolvers,
  Query,
  QueryResolvers,
} from "../../generated/graphql/types";
import { Person as PersonGrpc } from "../../generated/grpcServer/person_pb";
import { House as HouseGrpc } from "../../generated/grpcServer/house_pb";
export const personresolver: {
  Person: PersonResolvers;
  Query: QueryResolvers;
} = {
  Query: {
    people: async (
      source: Partial<Query>,
      args: {},
      context: any,
      info: GraphQLResolveInfo
    ): Promise<PersonGraphql[]> => {
      return allPeople.map((h: PersonGrpc.AsObject) => {
        return {
          id: h.id?.value ?? -1,
          firstname: h.firstname?.value ?? "",
          lastname: h.lastname?.value ?? "",
          fullname: h.firstname?.value + " " + h.lastname?.value,
        };
      });
    },
  },
  Person: {
    fullname: async (
      source: Partial<PersonGraphql>,
      args: {},
      context: any,
      info: GraphQLResolveInfo
    ): Promise<string> => {
      return source.firstname + " " + source.lastname;
    },
    houses: async (
      source: Partial<PersonGraphql>,
      args: {},
      context: any,
      info: GraphQLResolveInfo
    ): Promise<HouseGraphql[]> => {
      const houses = allHouse.filter((d) => d.ownerid?.value === source.id);

      return houses.map((h: HouseGrpc.AsObject) => {
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
          Owner: ({ id: h.ownerid?.value } as any) as PersonGraphql,
        };
      });
    },
  },
};
export default personresolver;
