import { View, Text, Image, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

const likeIcon = <AntDesignIcons name="hearto" size={30} color="white" />;
const likedIcon = <AntDesignIcons name="heart" size={30} color="red" />;

const commentIcon = (
  <FontAwesomeIcons name="comments" size={30} color="white" />
);

const shareIcon = (
  <MaterialCommunityIcons name="share" size={30} color="white" />
);

const saveButton = (
  <FontAwesomeIcons name="bookmark-o" size={30} color="white" />
);

const Post = ({ post }) => {
  return (
    <>
      <View style={styles.postContainer}>
        <PostHeader post={post} />
        <PostImage post={post} />
        <PostFooter post={post} />
      </View>
      <View
        style={{
          borderBottomColor: "lightgrey",
          borderBottomWidth: 0.2,
        }}
      />
    </>
  );
};
const PostHeader = ({ post }) => {
  return (
    <View style={styles.postHeaderContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={styles.headerImage}
          source={{
            uri: post.profile_picture,
          }}
        />
        <Text style={{ color: "white", paddingLeft: 10 }}>{post.username}</Text>
      </View>
      <Text style={{ color: "white" }}>...</Text>
    </View>
  );
};

const PostImage = ({ post }) => {
  return (
    <View>
      <Image
        style={styles.postImage}
        source={{
          uri: post.imageUrl,
        }}
      />
    </View>
  );
};
const PostFooter = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [commentBoxOpen, setCommentBoxOpen] = useState(false);

  const handleLike = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      if (!liked) {
        await updateDoc(postRef, { likes: likesCount + 1 });
        setLiked(true);
        setLikesCount(likesCount + 1); // Increment likes count
      } else {
        await updateDoc(postRef, { likes: likesCount - 1 });
        setLiked(false);
        setLikesCount(likesCount - 1); // Decrement likes count
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: arrayUnion({ user: "User", comment: commentText }),
      });
      setComments([...comments, { user: "User", comment: commentText }]);
      setCommentText("");
      setCommentBoxOpen(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <View style={styles.footerContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleLike}>
            {liked ? likedIcon : likeIcon}
            {/* Toggle between liked and unliked icon */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpen(setCommentBoxOpen(!commentBoxOpen))}
          >
            {commentIcon}
          </TouchableOpacity>
          <TouchableOpacity>{shareIcon}</TouchableOpacity>
        </View>
        {/* save icon */}
        <TouchableOpacity>{saveButton}</TouchableOpacity>
      </View>

      {/* likes */}
      <View>
        <View style={{ marginVertical: 5 }}>
          <Text style={{ color: "white", fontSize: 12 }}>
            {likesCount.toLocaleString()} likes
          </Text>
        </View>
        {/* caption */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: "white",
              fontWeight: "600",
            }}
          >
            {post.username + " "}
            <Text
              style={{
                color: "lightgrey",
                fontSize: 12,
              }}
            >
              {post.caption}
            </Text>
          </Text>
        </View>
      </View>
      {/* comments */}
      <View>
        {comments && comments.length > 0 ? (
          <TouchableOpacity onPress={() => setOpen(!open)}>
            <Text style={{ color: "white", marginVertical: 5 }}>
              {!open ? "Show All comments" : "Hide Comments"}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={{ display: !open ? "none" : "flex" }}>
          {comments &&
            comments.map((comment, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 3,
                    }}
                  >
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: "lightblue",
                        borderWidth: 1,
                        borderRadius: 50,
                      }}
                      source={{
                        uri: comment.image,
                      }}
                    />
                    <Text
                      style={{
                        color: "white",
                        paddingLeft: 10,
                      }}
                    >
                      {comment.user}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 12,
                      marginLeft: 45,
                    }}
                  >
                    {comment.comment}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
      {commentBoxOpen && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 100,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 40,
              backgroundColor: "white",
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
          />
          <Button
            title="Post"
            onPress={() => {
              handleAddComment();
              setOpen(false); // Hiding the input box after posting a comment
            }}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  headerImage: {
    height: 50,
    width: 50,
    borderColor: "lightblue",
    borderWidth: 0.2,
    borderRadius: 50,
  },
  postImage: {
    height: 400,
    resizeMode: "cover",
  },
  postContainer: {
    padding: 2,
  },
  postHeaderContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  footerContainer: {
    padding: 5,
    margin: 5,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 20,
  },
  icons: {
    width: 30,
    height: 30,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default Post;
