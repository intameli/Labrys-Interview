import type { TRPCRouterRecord } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { Post } from "@acme/db";
import { CreatePostSchema } from "@acme/validators";

import type { CryptocurrencyListingsResponse } from "../types";
import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure
    .input(z.object({ sort: z.string() }))
    .query(async ({ input }) => {
      let response = null;
      try {
        response = await axios.get(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=25&" +
            input.sort,
          {
            headers: {
              "X-CMC_PRO_API_KEY": "1281325f-c9b5-4f1f-99bb-a8d9a3105ad6",
            },
          },
        );
      } catch (ex) {
        response = null;
        // error
        console.log(ex);
        // return new TRPCError({ code: "BAD_REQUEST" });
      }
      if (response) {
        // success
        const json = response.data as CryptocurrencyListingsResponse;
        console.log(json);
        return json.data.map((coin) => ({
          symbol: coin.symbol,
          rank: coin.cmc_rank,
          price: coin.quote.USD.price,
          marketCap: coin.quote.USD.market_cap,
          change: coin.quote.USD.percent_change_24h,
        }));
      }
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const post = await Post.findById(input.id);

      if (!post) return null;

      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
      };
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ input }) => {
      await Post.create(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    await Post.findByIdAndDelete(input);
  }),
} satisfies TRPCRouterRecord;
