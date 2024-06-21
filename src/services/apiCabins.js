import supabase, {supabaseUrl} from "./supabase.js";

export async function getCabins() {

    const { data, error } = await supabase.from('cabins').select('*');

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be loaded!');
    }

    return data;
}

export async function deleteCabin(id) {

    const { data, error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
        console.log(error);
        throw new Error('Cabins could not be deleted!');
    };

    return data;

}

export async function createEditCabin(newCabin, id) {
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
    const uniqueImageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/",""); // replacing bcuz supabase will create folders in bucket
    const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${uniqueImageName}`;

    // 1. Create/Edit cabin
    let query = supabase.from('cabins');
        // A) Create
    if (!id) { query = query.insert([{...newCabin, image: imagePath}]) }

    // B) Edit
    if (id) { query = query.update({ ...newCabin, image: imagePath }).eq('id', id).select() }

    const {data, error} = await query.select().single() ;

    if (error) {
        console.log(error);
        throw new Error('Cabins could not be Created!');
    };

    // 2. Upload image
    const { error:storageError } = await supabase.storage.from('cabin-images').upload(uniqueImageName, newCabin.image)

    // 3. Delete Cabin if there was an error uploading image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id);

        console.error(storageError);
        throw new Error(
            "Cabin image could not be uploaded and the cabin was not created"
        );
    }

    return data;

}