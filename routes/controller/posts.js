import { db } from '../../config/mysql.js';
import { postRepository, likeRepository, commentRepository, fileRepository } from '../data/index.js';
import logger from '../../config/logger.js';
import { transDate } from '../../utils/date.js';
export const rand = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

// 로그인 기능 합치기 전 랜덤 유저 id 뽑기
// export const USER_NUMBER = rand(1, 10);

export async function getAllTest(req, res, next) {
  const conn = await db.getConnection();
  const userId = req.user.id;

  try {
    const data = await postRepository.getAll(conn);
    const result = await Promise.all(
      data.map(async (post) => {
        const Images = await fileRepository.getAll(conn, post.id);
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          longitude: post.longitude,
          latitude: post.latitude,
          hits: post.hits,
          is_private: post.is_private,
          created_at: post.created_at,
          updated_at: post.updated_at,
          User: {
            id: post.userId,
            nickname: post.nickname,
            profile_image_url: post.profile_image_url,
          },
          Images,
        };
      }),
    );

    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// 팔로우 한 사람들 게시물 모두 가져오기
export async function getPosts(req, res, next) {
  const conn = await db.getConnection();
  const userId = req.user.id;
  const size = Number(req.query.size);
  const page = Number(req.query.page);
  try {
    const data = await postRepository.getFollowing(conn, userId);
    const result = await Promise.all(
      data.map(
        async ({
          id,
          title,
          content,
          longitude,
          latitude,
          hits,
          is_private,
          created_at,
          updated_at,
          userId,
          nickname,
          profile_image_url,
        }) => {
          const Images = await fileRepository.getAll(conn, id);
          return {
            id,
            title,
            content,
            longitude,
            latitude,
            hits,
            is_private,
            created_at,
            updated_at,
            User: {
              id: userId,
              nickname,
              profile_image_url,
            },
            Images,
          };
        },
      ),
    );

    // const result = data.map((post) => ({
    //   id: post.id,
    //   title: post.title,
    //   content: post.content,
    //   longitude: post.longitude,
    //   latitude: post.latitude,
    //   hits: post.hits,
    //   is_private: post.is_private,
    //   created_at: post.created_at,
    //   updated_at: post.updated_at,
    //   User: {
    //     id: post.userId,
    //     nickname: post.nickname,
    //     profile_image_url: post.profile_image_url,
    //   },
    // }));
    // const totalCount = result.length;
    // const totalPages = Math.round(totalCount / size);

    // setTimeout(() => {
    //   return res.status(200).json({
    //     contents: result.slice(page * size, (page + 1) * size),
    //     pageNumber: page,
    //     pageSize: size,
    //     totalPages,
    //     totalCount,
    //     isLastPage: totalPages <= page,
    //     isFirstPage: page === 0,
    //   });
    // }, 300);
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// postId로 특정 게시물 정보 가져오기
export async function getPost(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    postRepository.updateHits(conn, postId);
    let [post, Likers, Comments, childComments, Images] = await Promise.all([
      postRepository.getById(conn, postId),
      likeRepository.getAll(conn, postId),
      commentRepository.getParentComments(conn, postId),
      commentRepository.getChildComments(conn, postId),
      fileRepository.getAll(conn, postId),
    ]);

    const { userId, nickname, profile_image_url } = post;
    post.userId = undefined;
    post.nickname = undefined;
    post.profile_image_url = undefined;
    Comments = Comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      pid: comment.pid,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      User: {
        id: comment.userId,
        nickname: comment.nickname,
        profile_image_url: comment.profile_image_url,
      },
    }));
    childComments = childComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      pid: comment.pid,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      User: {
        id: comment.userId,
        nickname: comment.nickname,
        profile_image_url: comment.profile_image_url,
      },
    }));

    Comments.map((comment) => {
      comment.Comments = childComments.filter((el) => el.pid === comment.id);
      return comment;
    });

    post.Hashtags = await postRepository.getPostHashTags(conn, postId);
    post.Mentions = await postRepository.getPostMentions(conn, userId, postId);
    post.Images = Images;
    post.User = { id: userId, nickname, profile_image_url };
    post.Comments = Comments;
    post.Likers = Likers;
    post.created_at = transDate(post.created_at);
    post.updated_at = transDate(post.updated_at);

    return res.status(200).json({ ...post });
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// 게시물 생성하기
export async function createPost(req, res, next) {
  const { title, content, longitude, latitude, is_private, mentions, hashtags, images } = req.body;
  const userId = req.user.id;
  const post = { title, content, longitude, latitude, is_private };
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const newPost = await postRepository.create(conn, userId, post, mentions, hashtags, images).catch(console.error);

    await conn.commit();
    return res.status(201).json(newPost);
  } catch (err) {
    await conn.rollback();
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// image 데이터 서버에 저장하고 uuid값 돌려주기
export async function createMedia(req, res, next) {
  const images = req.files;
  const currentFile = Object.values(req.body);
  const result = images.map((el) => el.filename);
  result.push(...currentFile);
  return res.status(200).json(result);
}

// 게시물 수정하기
export async function updatePost(req, res, next) {
  const { postId } = req.params;
  const { title, content, longitude, latitude, is_private, mentions, hashtags, images } = req.body;
  // const userId = req.user.id;
  const userId = req.user.id;
  const post = { title, content, longitude, latitude, is_private };
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const newPost = await postRepository
      .update(conn, userId, postId, post, mentions, hashtags, images)
      .catch(console.error);

    await conn.commit();

    return res.status(201).json(newPost);
  } catch (err) {
    await conn.rollback();
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// 게시물 삭제하기
export async function removePost(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await postRepository.remove(conn, postId);
    await conn.commit();
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    await conn.rollback();
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function getByBounds(req, res, next) {
  const { swLat, swLng, neLat, neLng, tab } = req.query;
  const conn = await db.getConnection();
  const userId = req.user.id;
  try {
    let result;
    switch (tab) {
      case 'home':
        result = await postRepository.getByBounds(conn, userId, swLat, neLat, swLng, neLng);
        // result = await Promise.all(
        //   result.map(async (post) => {
        //     post.Images = await fileRepository.getAll(conn, post.id);
        //     if (post.Images.length !== 0) {
        //       post.Images = post.Images[0];
        //     }
        //     return post;
        //   }),
        // );
        result = await Promise.all(
          result.map(async (post) => {
            post.Images = await fileRepository.getAll(conn, post.id);
            if (post.Images.length !== 0) {
              post.Images = post.Images[0];
            }
            return {
              id: post.id,
              title: post.title,
              content: post.content,
              longitude: post.longitude,
              latitude: post.latitude,
              hits: post.hits,
              is_private: post.is_private,
              created_at: post.created_at,
              updated_at: post.updated_at,
              User: {
                id: post.userId,
                nickname: post.nickname,
                profile_image_url: post.profile_image_url,
              },
              Images,
            };
          }),
        );
        return res.status(200).json(result);

      //TODO 탐색탭
      case 'explore':
        return res.status(200).json(result);
      default:
        return res.status(403).json({ message: 'invalid tab' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
